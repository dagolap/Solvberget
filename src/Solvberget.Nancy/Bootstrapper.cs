﻿using Autofac;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Bootstrappers.Autofac;
using Nancy.LightningCache.Extensions;
using Nancy.Responses;
using Nancy.Responses.Negotiation;
using Nancy.Routing;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Solvberget.Domain.Aleph;
using Solvberget.Domain.Lists;
using Solvberget.Domain.Utils;

namespace Solvberget.Nancy
{
    public class Bootstrapper : AutofacNancyBootstrapper
    {
        protected override NancyInternalConfiguration InternalConfiguration
        {
            get { return NancyInternalConfiguration.WithOverrides(OverrideDefaultConfiguration); }
        }
        
        protected override void ApplicationStartup(ILifetimeScope container, IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);

            /*enable lightningcache, vary by url params id,query,take and skip*/
            this.EnableLightningCache(container.Resolve<IRouteResolver>(), ApplicationPipelines, new[] { "id", "query", "take", "skip" });

            pipelines.OnError.AddItemToEndOfPipeline((z, a) =>
            {
                while (null != a.InnerException) a = a.InnerException;

                return new TextResponse(a.Message) {StatusCode = HttpStatusCode.InternalServerError};
            });

        }

        protected override void ConfigureApplicationContainer(ILifetimeScope container)
        {
            var jsonSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            

            container.Update(builder =>
            {
                builder.Register(c => JsonSerializer.Create(jsonSettings))
                    .SingleInstance();

                builder.RegisterAssemblyTypes(typeof(AlephRepository).Assembly)
                    .AsImplementedInterfaces();

                builder.RegisterType<EnvironmentPathProvider>()
                    .As<IEnvironmentPathProvider>()
                    .SingleInstance();



                builder.RegisterType<LibraryListDynamicRepository>().AsSelf();
                builder.RegisterType<LibraryListXmlRepository>().AsSelf();
            });
        }

        private static void OverrideDefaultConfiguration(NancyInternalConfiguration config)
        {
            config.ResponseProcessors = new[] { typeof(JsonProcessor) };
        }
    }
}