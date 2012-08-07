﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Store;
using SpellChecker.Net.Search.Spell;
using Directory = System.IO.Directory;

namespace Solvberget.Domain.Implementation
{
    public class DictionaryBuilder
    {
        public static void Build(string dictionaryPath, string indexPath)
        {

            var di = CreateTargetFolder(indexPath);
            // var fi = new FileInfo(_pathToDict);
            var fi = new FileInfo(dictionaryPath);
            using (var staticSpellChecker = new SpellChecker.Net.Search.Spell.SpellChecker(FSDirectory.Open(di)))
            {
                try
                {
                    staticSpellChecker.IndexDictionary(new PlainTextDictionary(fi));
                }
                catch (Exception e)
                {

                    Console.WriteLine(e.Message);
                }
                
            }

        }

        public static void Add(string dictionaryPath, string value)
        {
            var di = CreateTargetFolder(dictionaryPath);
            IndexReader indexReader = IndexReader.Open(dictionaryPath);
            using (var staticSpellChecker = new SpellChecker.Net.Search.Spell.SpellChecker(FSDirectory.Open(di)))
            {
                // To index a field of a user index:
                try
                {
                    staticSpellChecker.IndexDictionary(new LuceneDictionary(indexReader, value));
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);

                    
                }
              
            }
        }

        public static DirectoryInfo CreateTargetFolder(string path)
        {
            var di = new DirectoryInfo(path);
            if (!di.Exists)
            {
                Directory.CreateDirectory(path);
            }
            return di;
        }
    }
}
