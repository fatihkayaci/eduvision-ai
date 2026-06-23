using EduVision.Application.Comman.Interfaces;
using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduVision.Infrastructure.Persistence.Repositories;

public sealed class StudentRepository(ApplicationDbContext dbContext) : IStudentRepository
{
    public Task<StudentProfile?> GetProfileAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        return dbContext.StudentProfiles
            .AsNoTracking()
            .Include(sp => sp.User)
            .Include(sp => sp.Enrollment)
                .ThenInclude(e => e.ClassRoom)
            .FirstOrDefaultAsync(sp => sp.UserId == studentId, cancellationToken);
    }
}
