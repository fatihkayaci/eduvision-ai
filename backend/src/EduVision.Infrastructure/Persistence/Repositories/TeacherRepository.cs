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

    public async Task<List<StudentProfile>> GetClassStudentsAsync(Guid classroomCourseId, CancellationToken cancellationToken = default)
    {
        var classRoomId = await dbContext.ClassroomCourses
            .Where(cc => cc.Id == classroomCourseId)
            .Select(cc => (Guid?)cc.ClassRoomId)
            .FirstOrDefaultAsync(cancellationToken);

        if (classRoomId is null) return [];

        return await dbContext.StudentProfiles
            .AsNoTracking()
            .Include(sp => sp.User)
            .Where(sp => dbContext.ClassEnrollments
                .Any(ce => ce.StudentId == sp.UserId && ce.ClassRoomId == classRoomId))
            .OrderBy(sp => sp.StudentNumber)
            .ToListAsync(cancellationToken);
    }
}
