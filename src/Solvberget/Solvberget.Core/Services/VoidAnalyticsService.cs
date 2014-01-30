using System.Collections.Generic;
using Solvberget.Core.Services.Interfaces;

namespace Solvberget.Core.Services
{
    /// <summary>
    /// Does nothing. Implement and inject platform specific analytics instead.
    /// </summary>
    public class VoidAnalyticsService : IAnalyticsService
    {
        public void StartSession()
        {
        }

        public void LogEvent(string eventName)
        {
        }

        public void LogEvent(string eventName, IDictionary<string, string> args)
        {
        }

        public void LogTimedEvent(string eventName)
        {
        }

        public void LogTimedEvent(string eventName, IDictionary<string, string> args)
        {
        }

        public void EndTimedEvent(string eventName)
        {
        }
    }
}
