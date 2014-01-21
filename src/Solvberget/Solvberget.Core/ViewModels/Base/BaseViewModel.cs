using Cirrious.CrossCore;
using Cirrious.MvvmCross.ViewModels;
using System.Threading;
using System;
using Solvberget.Core.Services;
using Solvberget.Core.Services.Interfaces;

namespace Solvberget.Core.ViewModels.Base
{
    public class BaseViewModel : MvxViewModel
    {
		public static bool AddEmptyItemForEmptyLists = true;

        public IAnalyticsService Analytics { get; set; }

        readonly ManualResetEvent _viewModelReady = new ManualResetEvent(false);

		public void WaitForReady(Action onReady)
		{
			ThreadPool.QueueUserWorkItem(s =>
				{
					_viewModelReady.WaitOne();
					onReady();
				});
		}

        public override void Start()
        {
            base.Start();
            Analytics = Mvx.Resolve<IAnalyticsService>() ?? new VoidAnalyticsService();
            Analytics.LogEvent("VM_" + GetType().Name);
            
        }

        protected void NotifyViewModelReady()
		{
			_viewModelReady.Set();
		}

		public virtual void OnViewReady()
		{
		}

        private long _id;
        /// <summary>
        /// Gets or sets the unique ID for the menu
        /// </summary>
        public long Id
        {
            get { return _id; }
            set { _id = value; RaisePropertyChanged(() => Id); }
        }

        private string _title = string.Empty;
        /// <summary>
        /// Gets or sets the name of the menu
        /// </summary>
        public string Title
        {
            get { return _title; }
            set { _title = value; RaisePropertyChanged(() => Title); }
        }

        private bool _isLoading;
        public bool IsLoading 
        {
            get { return _isLoading; }
            set { _isLoading = value; RaisePropertyChanged(() => IsLoading);}
        }
    }
}
