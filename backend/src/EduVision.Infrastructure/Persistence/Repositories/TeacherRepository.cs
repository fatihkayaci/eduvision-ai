using EduVision.Application.Comman.Interfaces;
using EduVision.Application.Features.Teacher.Queries.GetClassStudents;
using EduVision.Application.Features.Teacher.Queries.GetCourseAssignments;
using EduVision.Application.Features.Teacher.Queries.GetCourses;
using EduVision.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EduVision.Infrastructure.Persistence.Repositories;

public sealed class TeacherRepository(ApplicationDbContext dbContext) : ITeacherRepository
{
    public Task<List<GetCoursesResponse>> GetCoursesAsync(Guid teacherId, CancellationToken cancellationToken = default)
    {
        return dbContext.ClassroomCourses
            .AsNoTracking()
            .Where(cc => cc.TeacherId == teacherId)
            .OrderBy(cc => cc.ClassRoom.GradeLevel)
            .ThenBy(cc => cc.ClassRoom.Section)
            .Select(cc => new GetCoursesResponse(
                cc.Id,
                cc.Course.Name,
                cc.ClassRoom.GradeLevel,
                cc.ClassRoom.Section,
                dbContext.ClassEnrollments.Count(ce => ce.ClassRoomId == cc.ClassRoomId),
                dbContext.Grades
                    .Where(g => g.ClassroomCourseId == cc.Id)
                    .Average(g => (decimal?)g.Value)))
            .ToListAsync(cancellationToken);
    }

    public async Task<List<GetClassStudentsResponse>> GetClassStudentsAsync(Guid classroomCourseId, CancellationToken cancellationToken = default)
    {
        var classRoomId = await dbContext.ClassroomCourses
            .Where(cc => cc.Id == classroomCourseId)
            .Select(cc => (Guid?)cc.ClassRoomId)
            .FirstOrDefaultAsync(cancellationToken);

        if (classRoomId is null) return [];

        return await dbContext.StudentProfiles
            .AsNoTracking()
            .Where(sp => dbContext.ClassEnrollments
                .Any(ce => ce.StudentId == sp.UserId && ce.ClassRoomId == classRoomId))
            .OrderBy(sp => sp.StudentNumber)
            .Select(sp => new GetClassStudentsResponse(
                sp.UserId,
                sp.User.FirstName,
                sp.User.LastName,
                sp.StudentNumber,
                dbContext.Grades
                    .Where(g => g.ClassroomCourseId == classroomCourseId && g.StudentId == sp.UserId)
                    .Average(g => (decimal?)g.Value),
                dbContext.Attendances
                    .Count(a => a.StudentId == sp.UserId && a.Type == AttendanceType.Absent),
                dbContext.Attendances
                    .Count(a => a.StudentId == sp.UserId && a.Type == AttendanceType.Excused)))
            .ToListAsync(cancellationToken);
    }

    public async Task<List<GetCourseAssignmentsResponse>> GetCourseAssignmentsAsync(Guid classroomCourseId, Guid termId, CancellationToken cancellationToken = default)
    {
        var classRoomId = await dbContext.ClassroomCourses
            .Where(cc => cc.Id == classroomCourseId)
            .Select(cc => (Guid?)cc.ClassRoomId)
            .FirstOrDefaultAsync(cancellationToken);

        if (classRoomId is null) return [];

        return await dbContext.Assignments
            .AsNoTracking()
            .Where(a => a.ClassRoomId == classRoomId && a.TermId == termId)
            .OrderBy(a => a.DueDate)
            .Select(a => new GetCourseAssignmentsResponse(
                a.Id,
                a.Title,
                a.Type.ToString(),
                a.DueDate))
            .ToListAsync(cancellationToken);
    }
}
