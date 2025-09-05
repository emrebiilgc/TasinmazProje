using Microsoft.EntityFrameworkCore;
using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Context
{
    public class TasinmazDbContext : DbContext
    {
        public TasinmazDbContext(DbContextOptions<TasinmazDbContext> options)
            : base(options)
        {
        }

        public DbSet<City> Cities { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<Neighborhood> Neighborhoods { get; set; }
        public DbSet<Property> Properties { get; set; }
        
        public DbSet<User> Users { get; set; }
        
        public DbSet<Log> Logs { get; set; }
         

    }
}