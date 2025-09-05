using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;
using TasinmazProje.DataAccess.Context;

namespace TasinmazProje.DataAccess
{
    public class TasinmazDbContextFactory : IDesignTimeDbContextFactory<TasinmazDbContext>
    {
        public TasinmazDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var builder = new DbContextOptionsBuilder<TasinmazDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            builder.UseNpgsql(connectionString);

            return new TasinmazDbContext(builder.Options);
        }
    }
}