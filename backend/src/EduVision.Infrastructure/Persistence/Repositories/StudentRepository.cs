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
            .Include(sp => sp.Enrollment)
                .ThenInclude(e => e.ClassRoom)
            .FirstOrDefaultAsync(sp => sp.UserId == studentId, cancellationToken);
    }

    public async Task<List<ClassroomCourse>> GetCoursesWithGradesAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        var classroomId = await dbContext.ClassEnrollments
            .AsNoTracking()
            .Where(e => e.StudentId == studentId)
            .Select(e => e.ClassRoomId)
            .FirstOrDefaultAsync(cancellationToken);

        if (classroomId == Guid.Empty)
            return [];

        return await dbContext.ClassroomCourses
            .AsNoTracking()
            .Where(cc => cc.ClassRoomId == classroomId)
            .Include(cc => cc.Course)
            .Include(cc => cc.Grades.Where(g => g.StudentId == studentId))
            .ToListAsync(cancellationToken);
    }
}
