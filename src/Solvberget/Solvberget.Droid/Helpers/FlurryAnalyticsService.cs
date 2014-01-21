using System.Collections.Generic;
using Android.Content;
using Com.Flurry.Android;
using Solvberget.Core.Services.Interfaces;

namespace Solvberget.Droid.Helpers
{
    public class FlurryAnalyticsService :  IAnalyticsService, IAndroidAnalytics
    {
        public const string ApiKeyValue = "G3T5P49RBR984Y7DKQ73";

        public void StartSession() { }

        public void StartSession(Context ctx)
        {
            FlurryAgent.OnStartSession(ctx, ApiKeyValue);
        }

        public void EndSession(Context ctx)
        {
            FlurryAgent.OnEndSession(ctx);
        }

        public void LogEvent(string eventName)
        {
            FlurryAgent.LogEvent(eventName);
        }

        public void LogEvent(string eventName, IDictionary<string, string> args)
        {
            FlurryAgent.LogEvent(eventName, args);
        }

        public void LogTimedEvent(string eventName)
        {
            FlurryAgent.LogEvent(eventName, true);
        }

        public void LogTimedEvent(string eventName, IDictionary<string, string> args)
        {
            FlurryAgent.LogEvent(eventName, args, true);
        }

        public void EndTimedEvent(string eventName)
        {
            FlurryAgent.EndTimedEvent(eventName);
        }
    }

    public interface IAndroidAnalytics
    {
        void StartSession(Context ctx);
        void EndSession(Context ctx);
    }
}