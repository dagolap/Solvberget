﻿(function () {

    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var nav = WinJS.Navigation;

    var listRequestUrl = Data.serverBaseUrl + "/List/GetListsStaticAndDynamic";
    var docRequestUrl = Data.serverBaseUrl + "/Document/GetDocumentLight/";
    var thumbRequestUrl = Data.serverBaseUrl + "/Document/GetDocumentThumbnailImage/";

    var lists = new Array();
    var listsBinding;

    var listSelectionIndex = 0;
    var continueToGetDocuments = false;

    ui.Pages.define("/pages/lists/libraryLists.html", {

        ready: function (element, options) {

            continueToGetDocuments = true;

            //Set page header
            element.querySelector("header[role=banner] .pagetitle").textContent = "Anbefalinger";

            //Init ListView
            var listView = element.querySelector(".listView").winControl;
            if (listView) {
                listView.layout = new ui.ListLayout();
                listView.onselectionchanged = this.listViewSelectionChanged.bind(this);
                listView.itemTemplate = document.getElementById("listViewTemplateId");
            }

            //Get the lists
            this.getLists(listRequestUrl, listView);

            document.getElementById("appBar").addEventListener("beforeshow", setAppbarButton());

        },

        unload: function () {
            continueToGetDocuments = false;
            Solvberget.Queue.CancelQueue('libraryList');
            //Solvberget.Queue.QueueDownload('libraryList', null, null, null);
            console.log("Unload triggered");
        },

        listViewSelectionChanged: function (args) {
            if (!continueToGetDocuments) return;
            var that = this;
            var listViewForListsElement = this.element.querySelector(".listView");
            var listViewForLists = listViewForListsElement.winControl;
            if (listViewForLists) {
                listViewForLists.selection.getItems().done(function updateDetails(items) {
                    if (items.length > 0) {
                        listSelectionIndex = items[0].index;
                        var listContent = that.element.querySelector(".listContentSection");
                        binding.processAll(listContent, items[0].data);

                        that.renderListContent(items[0].data);
                        listContent.scrollTop = 0;
                        Solvberget.Queue.PrioritizeUrls('libraryList', items[0].data.urls);
                        if (that.doneLoadingDocuments(items[0].data.DocumentNumbers)) {
                            $(".headerProgress").hide();
                        }

                    }
                });
            }
        },

        doneLoadingDocuments: function (documentNumbers) {
            if (documentNumbers !== undefined) {
                for (var docnumber in documentNumbers) {
                    if (!documentNumbers[docnumber]) {
                        //return false;
                    }
                }
            }
            return true;
        },

        getLists: function (requestStr, listView) {
            var that = this;

            WinJS.xhr({ url: requestStr }).then(
                function (request) {
                    if (!continueToGetDocuments) return;
                    var obj = JSON.parse(request.responseText);
                    if (obj.Lists !== undefined) {
                        lists = obj.Lists;
                        listsBinding = new WinJS.Binding.List(lists);
                        listView.itemDataSource = listsBinding.dataSource;
                        listView.selection.set(listSelectionIndex);
                        // Hide progress-ring, show content
                        $("#listsLoading").hide();
                        $("#listViewId").fadeIn();
                        that.processRemainingDocuments();
                    } else {
                        //Error handling   
                    }
                },
                function (request) {
                    //Error handling
                });
        },

        isSingleColumn: function () {
            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            return (viewState === appViewState.snapped || viewState === appViewState.fullScreenPortrait);
        },

        renderListContent: function (listModel) {
            var that = this;
            var documentTemplateHolder = document.getElementById("documentsHolder");
            documentTemplateHolder.innerHTML = "";
            var documentTemplateDiv = document.getElementById("documentTemplate");
            var documentTemplate = undefined;
            if (documentTemplateDiv)
                documentTemplate = new WinJS.Binding.Template(documentTemplateDiv);
            if (listModel.Documents) {
                for (var i = 0; i < listModel.Documents.length; i++) {
                    var doc = listModel.Documents[i];
                    if (documentTemplate && documentTemplateHolder && doc) {
                        that.populateDocElement(doc);
                        documentTemplateHolder.innerHTML += window.toStaticHTML(doc.element.innerHTML);

                        $('#' + doc.DocumentNumber).die('click').live('click', function () {
                            var model = { DocumentNumber: $(this).attr("id") };
                            //nav.navigate("/pages/documentDetail/documentDetail.html", { documentModel: that.resolveDocumentFromDocumentNumber(documentNumber) });
                            nav.navigate("/pages/documentDetail/documentDetail.html", { documentModel: model });
                        });
                    }
                }
            }
        },

        resolveDocumentFromDocumentNumber: function (documentNumber) {
            if (documentNumber) {
                for (var i = 0; i < lists.length; i++) {
                    var listItem = lists[i];
                    for (var j = 0; j < listItem.Documents.length; j++) {
                        var document = listItem.Documents[j];
                        if (document.DocumentNumber == documentNumber) {
                            return document;
                        }
                    }
                }
            }
        },

        docIsVisible: function (docNumber) {
            var that = this;
            if (docNumber) {
                var items = lists[listSelectionIndex];
                for (var i = 0; i < items.Documents.length; i++) {
                    if (docNumber == items.Documents[i].DocumentNumber) {
                        return true;
                    }
                }
            }
            return false;
        },

        updateListViewSelectionIfDocIsVisible: function (docNumber) {
            if (this.docIsVisible(docNumber))
                this.listViewSelectionChanged();
        },

        populateDocElement: function (doc) {
            var that = this;
            if (doc) {
                if (doc.element === undefined) {
                    var item = new Object();
                    item.data = doc;
                    var documentTemplateDiv = document.getElementById("documentTemplate");
                    if (documentTemplateDiv) {
                        var documentTemplate = new WinJS.Binding.Template(documentTemplateDiv);
                        documentTemplate.renderItem(WinJS.Promise.wrap(item), true).renderComplete.then(function (renderedElement) {
                            doc.element = renderedElement;
                            doc.element.firstElementChild.id = doc.DocumentNumber;
                            if (doc.ThumbnailUrl !== undefined && doc.ThumbnailUrl != "") {
                                WinJS.Utilities.query("img", doc.element).forEach(function (img) {
                                    img.addEventListener("load", function () {
                                        WinJS.Utilities.addClass(img, "loaded");
                                        that.updateListViewSelectionIfDocIsVisible(doc.DocumentNumber);
                                    });
                                });
                            }
                        });
                    }
                }
            }
        },

        processRemainingDocuments: function () {
            var that = this;

            var completed = function (request, context) {
                var obj = JSON.parse(request.responseText);
                context.listItem.Documents.push(obj);
                context.listItem.DocumentNumbers[context.docNo] = true;
                that.processThumbnailOnDoc(context.listItem);
                that.updateListViewSelectionIfDocIsVisible(obj.DocumentNumber);
            }

            for (var i = 0; i < lists.length; i++) {
                var listItem = lists[i];
                if (!listItem.urls) listItem.urls = [];
                var documentNumbers = listItem.DocumentNumbers;

                for (var documentNumber in documentNumbers) {
                    if (!documentNumbers[documentNumber]) {
                        if (!listItem.Documents) {
                            listItem.Documents = new Array();
                        }
                        var reqStr = docRequestUrl + documentNumber;
                        var jsonContext = { listItem: listItem, docNo: documentNumber };
                        listItem.urls.push(reqStr);
                        Solvberget.Queue.QueueDownload('libraryList', { url: reqStr }, completed, jsonContext);
                    } else {
                        that.processThumbnailOnDoc(listItem);
                    }
                }
            }
        },

        processThumbnailOnDoc: function (doc) {
            var that = this;
            var completed = function (request, context) {
                var obj = JSON.parse(request.responseText);
                if (obj !== "") context.ThumbnailUrl = obj;
                context.element = undefined;
                that.populateDocElement(context);
            }

            if (doc !== undefined) {
                if (!doc.urls) doc.urls = [];
                var documents = doc.Documents;
                if (documents !== undefined) {
                    for (var j = 0; j < documents.length; j++) {
                        var checkDoc = documents[j];
                        if (checkDoc.ThumbnailUrl === undefined || checkDoc.ThumbnailUrl == "") {
                            if (checkDoc.TriedFetchingThumbnail === undefined) {
                                checkDoc.ThumbnailUrl = "/images/placeholders/" + checkDoc.DocType + ".png";
                                checkDoc.TriedFetchingThumbnail = true;
                                var url = thumbRequestUrl + checkDoc.DocumentNumber;
                                doc.urls.push(url);
                                Solvberget.Queue.QueueDownload('libraryList', { url: url }, completed, checkDoc, true);

                            }
                        }
                        else {
                            checkDoc.TriedFetchingThumbnail = true;
                        }
                        that.populateDocElement(checkDoc);
                    }
                }
            }
        },


    });
})();

