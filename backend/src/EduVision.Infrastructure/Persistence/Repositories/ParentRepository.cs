using EduVision.Application.Comman.Interfaces;
using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduVision.Infrastructure.Persistence.Repositories;

public sealed class ParentRepository(ApplicationDbContext dbContext) : IParentRepository
{
    public Task<List<StudentParent>> GetStudentsAsync(Guid parentId, CancellationToken cancellationToken = default)
    {
        return dbContext.StudentParents
            .AsNoTracking()
            .Include(sp => sp.Student)
            .Where(sp => sp.ParentId == parentId)
            .ToListAsync(cancellationToken);
    }
}
