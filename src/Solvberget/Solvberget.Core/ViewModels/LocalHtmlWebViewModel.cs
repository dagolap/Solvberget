using Solvberget.Core.ViewModels.Base;

namespace Solvberget.Core.ViewModels
{
    public class LocalHtmlWebViewModel : BaseViewModel
    {
        public void Init(string html, string title, string url)
        {
            Html = html;
            Title = title;
            Url = url;
        }

        private string _html;
        public string Html 
        {
            get { return _html; }
            set { _html = value; RaisePropertyChanged(() => Html);}
        }

        private string _url;
        public string Url 
        {
            get { return _url; }
            set { _url = value; RaisePropertyChanged(() => Url);}
        }
    }
}