using EduVision.Application.Comman.Interfaces;
using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduVision.Infrastructure.Persistence.Repositories;

public sealed class TermRepository(ApplicationDbContext dbContext) : ITermRepository
{
    public Task<List<Term>> GetBySchoolIdAsync(Guid schoolId, CancellationToken cancellationToken = default)
    {
        return dbContext.Terms
            .AsNoTracking()
            .Where(t => t.SchoolId == schoolId)
            .OrderByDescending(t => t.StartDate)
            .ToListAsync(cancellationToken);
    }
}
