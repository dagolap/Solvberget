﻿
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using Solvberget.Service.Models;

namespace Solvberget.Service.Tests
{
    [TestFixture]
    public class TestModelConvertionFromXml
    {
        [Test]
        public void GetDocumentFromXmlTest()
        {
            var media = Document.GetDocumentFromFindDocXml(getxml());

            Assert.AreEqual("Naiv. Super", media.Title);
        }

        [Test]
        public void GetBookFromXmlTest()
        {
            var book = Book.GetBookFromFindDocXml(getxml());

            Assert.AreEqual("Naiv. Super", book.Title);
            Assert.AreEqual("Loe, Erlend", book.Author);
        }




        private string getxml()
        {
            return @"<find-doc>
  <record>
    <metadata>
      <oai_marc>
        <fixfield id=""FMT"">BK</fixfield>
        <fixfield id=""LDR"">^^^^^nam^^^^^^^^^1</fixfield>
        <fixfield id=""008"">110106s2010^^^^^^^^^^^a^^^^^^^^^^1^nob^^</fixfield>
        <varfield id=""019"" i1="" "" i2="" "">
          <subfield label=""b"">l</subfield>
          <subfield label=""d"">R</subfield>
        </varfield>
        <varfield id=""020"" i1="" "" i2="" "">
          <subfield label=""a"">978-82-02-33225-9</subfield>
          <subfield label=""b"">ib.</subfield>
        </varfield>
        <varfield id=""090"" i1="" "" i2="" "">
          <subfield label=""d"">LOE</subfield>
        </varfield>
        <varfield id=""100"" i1="" "" i2=""0"">
          <subfield label=""a"">Loe, Erlend</subfield>
          <subfield label=""d"">1969-</subfield>
          <subfield label=""j"">n</subfield>
        </varfield>
        <varfield id=""245"" i1=""1"" i2=""0"">
          <subfield label=""a"">Naiv. Super</subfield>
          <subfield label=""c"">Erlend Loe</subfield>
        </varfield>
        <varfield id=""260"" i1="" "" i2="" "">
          <subfield label=""a"">[Oslo]</subfield>
          <subfield label=""b"">Cappelen Damm</subfield>
          <subfield label=""c"">2010</subfield>
        </varfield>
        <varfield id=""300"" i1="" "" i2="" "">
          <subfield label=""a"">205 s.</subfield>
        </varfield>
        <varfield id=""440"" i1="" "" i2=""0"">
          <subfield label=""a"">Favoritt</subfield>
        </varfield>
        <varfield id=""503"" i1="" "" i2="" "">
          <subfield label=""a"">1. utg.: Oslo : Cappelen, 1996</subfield>
        </varfield>
        <varfield id=""599"" i1="" "" i2="" "">
          <subfield label=""a"">200 kr</subfield>
        </varfield>
        <varfield id=""850"" i1="" "" i2="" "">
          <subfield label=""a"">stavangb</subfield>
          <subfield label=""c"">LOE</subfield>
          <subfield label=""d"">2010</subfield>
        </varfield>
        <varfield id=""CAT"" i1="" "" i2="" "">
          <subfield label=""a"">LHA</subfield>
          <subfield label=""b"">30</subfield>
          <subfield label=""c"">20110106</subfield>
          <subfield label=""l"">NOR01</subfield>
          <subfield label=""h"">1254</subfield>
        </varfield>
        <varfield id=""CAT"" i1="" "" i2="" "">
          <subfield label=""a"">BATCH-UPD</subfield>
          <subfield label=""b"">30</subfield>
          <subfield label=""c"">20110106</subfield>
          <subfield label=""l"">NOR01</subfield>
          <subfield label=""h"">1254</subfield>
        </varfield>
        <varfield id=""CAT"" i1="" "" i2="" "">
          <subfield label=""a"">KATALOG</subfield>
          <subfield label=""b"">40</subfield>
          <subfield label=""c"">20110201</subfield>
          <subfield label=""l"">NOR01</subfield>
          <subfield label=""h"">1136</subfield>
        </varfield>
      </oai_marc>
    </metadata>
  </record>
  <session-id>XXIT5PJTANKBX77H4PR6X8VJMN3BTGXFEURFSCSIH4FBMJSXHX</session-id>
</find-doc>";
        }
    }
}
