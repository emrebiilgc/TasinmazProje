using Microsoft.EntityFrameworkCore;
using TasinmazProje.DataAccess.Context;
using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories;

public class EfLogRepository : ILogRepository
{
    private readonly TasinmazDbContext _context;

    public EfLogRepository(TasinmazDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Log log)
    {
        await _context.Logs.AddAsync(log);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Log>> GetAllAsync()
    {
        return await _context.Logs.ToListAsync();
    }
}