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

    public Task<List<ClassroomCourse>> GetCoursesWithGradesAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default)
    {
        return dbContext.ClassroomCourses
            .AsNoTracking()
            .Where(cc => dbContext.ClassEnrollments
                .Any(e => e.StudentId == studentId && e.ClassRoomId == cc.ClassRoomId))
            .Include(cc => cc.Course)
            .Include(cc => cc.Grades.Where(g => g.StudentId == studentId && g.TermId == termId))
            .ToListAsync(cancellationToken);
    }

    public Task<List<Attendance>> GetAttendancesAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default)
    {
        return dbContext.Attendances
            .AsNoTracking()
            .Where(a => a.StudentId == studentId && a.TermId == termId)
            .OrderBy(a => a.Date)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Assignment>> GetAssignmentsAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default)
    {
        return dbContext.Assignments
            .AsNoTracking()
            .Where(a => a.TermId == termId && dbContext.ClassEnrollments
                .Any(e => e.StudentId == studentId && e.ClassRoomId == a.ClassRoomId))
            .OrderBy(a => a.DueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<(int Rank, int TotalStudents)?> GetClassRankAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default)
    {
        var classRoomId = await dbContext.ClassEnrollments
            .Where(e => e.StudentId == studentId)
            .Select(e => (Guid?)e.ClassRoomId)
            .FirstOrDefaultAsync(cancellationToken);

        if (classRoomId is null) return null;

        var totalStudents = await dbContext.ClassEnrollments
            .CountAsync(e => e.ClassRoomId == classRoomId, cancellationToken);

        var studentAverages = await dbContext.Grades
            .Where(g => g.TermId == termId && dbContext.ClassEnrollments
                .Any(e => e.StudentId == g.StudentId && e.ClassRoomId == classRoomId))
            .GroupBy(g => g.StudentId)
            .Select(g => new { StudentId = g.Key, Average = g.Average(x => x.Value) })
            .OrderByDescending(x => x.Average)
            .ToListAsync(cancellationToken);

        var index = studentAverages.FindIndex(x => x.StudentId == studentId);
        if (index < 0) return null;

        return (index + 1, totalStudents);
    }

    public Task<List<ClassSchedule>> GetScheduleAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default)
    {
        return dbContext.ClassSchedules
            .AsNoTracking()
            .Where(cs => cs.TermId == termId && dbContext.ClassEnrollments
                .Any(e => e.StudentId == studentId && e.ClassRoomId == cs.ClassroomCourse.ClassRoomId))
            .Include(cs => cs.ClassroomCourse)
                .ThenInclude(cc => cc.Course)
            .OrderBy(cs => cs.Weekday)
                .ThenBy(cs => cs.StartTime)
            .ToListAsync(cancellationToken);
    }
}
