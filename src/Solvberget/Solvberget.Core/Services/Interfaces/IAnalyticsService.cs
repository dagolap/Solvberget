using System.Collections.Generic;

namespace Solvberget.Core.Services.Interfaces
{
    public interface IAnalyticsService
    {
        void StartSession();
        void LogEvent(string eventName);
        void LogEvent(string eventName, IDictionary<string, string> args);
        void LogTimedEvent(string eventName);
        void LogTimedEvent(string eventName, IDictionary<string, string> args);
        void EndTimedEvent(string eventName);
    }
}
