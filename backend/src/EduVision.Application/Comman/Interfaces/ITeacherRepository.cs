using EduVision.Application.Features.Teacher.Queries.GetClassStudents;
using EduVision.Application.Features.Teacher.Queries.GetCourseAssignments;
using EduVision.Application.Features.Teacher.Queries.GetCourses;
using EduVision.Application.Features.Teacher.Queries.GetSchedule;
using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface ITeacherRepository
{
    Task<List<GetCoursesResponse>> GetCoursesAsync(Guid teacherId, CancellationToken cancellationToken = default);
    Task<List<GetClassStudentsResponse>> GetClassStudentsAsync(Guid classroomCourseId, CancellationToken cancellationToken = default);
    Task<List<GetCourseAssignmentsResponse>> GetCourseAssignmentsAsync(Guid classroomCourseId, Guid termId, CancellationToken cancellationToken = default);
    Task<List<GetScheduleResponse>> GetScheduleAsync(Guid teacherId, Guid termId, CancellationToken cancellationToken = default);
}
