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

    public Task<List<ClassSchedule>> GetScheduleAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        return dbContext.ClassSchedules
            .AsNoTracking()
            .Where(cs => dbContext.ClassEnrollments
                .Any(e => e.StudentId == studentId && e.ClassRoomId == cs.ClassroomCourse.ClassRoomId))
            .Include(cs => cs.ClassroomCourse)
                .ThenInclude(cc => cc.Course)
            .OrderBy(cs => cs.Weekday)
                .ThenBy(cs => cs.StartTime)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Assignment>> GetAssignmentsAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        return dbContext.Assignments
            .AsNoTracking()
            .Where(a => dbContext.ClassEnrollments
                .Any(e => e.StudentId == studentId && e.ClassRoomId == a.ClassRoomId))
            .OrderBy(a => a.DueDate)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Attendance>> GetAttendancesAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        return dbContext.Attendances
            .AsNoTracking()
            .Where(a => a.StudentId == studentId)
            .OrderBy(a => a.Date)
            .ToListAsync(cancellationToken);
    }

    public Task<List<ClassroomCourse>> GetCoursesWithGradesAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        return dbContext.ClassroomCourses
            .AsNoTracking()
            .Where(cc => dbContext.ClassEnrollments
                .Any(e => e.StudentId == studentId && e.ClassRoomId == cc.ClassRoomId))
            .Include(cc => cc.Course)
            .Include(cc => cc.Grades.Where(g => g.StudentId == studentId))
            .ToListAsync(cancellationToken);
    }
}
