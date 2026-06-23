using EduVision.Application.Comman.Interfaces;
using EduVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduVision.Infrastructure.Persistence.Repositories;

public sealed class TeacherRepository(ApplicationDbContext dbContext) : ITeacherRepository
{
    public Task<List<ClassroomCourse>> GetCoursesAsync(Guid teacherId, CancellationToken cancellationToken = default)
    {
        return dbContext.ClassroomCourses
            .AsNoTracking()
            .Include(cc => cc.Course)
            .Include(cc => cc.ClassRoom)
            .Where(cc => cc.TeacherId == teacherId)
            .ToListAsync(cancellationToken);
    }
}
