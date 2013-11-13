﻿using System.Collections.Generic;
using System.Windows.Input;
using Cirrious.MvvmCross.ViewModels;
using Solvberget.Core.Services.Interfaces;
using Solvberget.Core.ViewModels.Base;
using System.Linq;

namespace Solvberget.Core.ViewModels
{
    public class EventListViewModel : BaseViewModel
    {
        private readonly IEventService _eventService;

        public EventListViewModel(IEventService eventService)
        {
            _eventService = eventService;
        }

        public void Init()
        {
            Load();
        }

        private async void Load()
        {
            IsLoading = true;

            Events = (from ev in await _eventService.GetList()
                select new EventViewModel
                {
                    Title = ev.Name
                }).ToList();

            IsLoading = false;
        }

        private List<EventViewModel> _events;
        public List<EventViewModel> Events 
        {
            get { return _events; }
            set { _events = value; RaisePropertyChanged(() => Events);}
        }

        private MvxCommand<EventViewModel> _showDetailsCommand;
        public ICommand ShowDetailsCommand
        {
            get
            {
                return _showDetailsCommand ?? (_showDetailsCommand = new MvxCommand<EventViewModel>(ExecuteShowDetailsCommand));
            }
        }

        private void ExecuteShowDetailsCommand(EventViewModel ev)
        {
            ShowViewModel<GenericWebViewViewModel>(new { uri = ev.Uri, title = ev.Title });
        }
    }
}
