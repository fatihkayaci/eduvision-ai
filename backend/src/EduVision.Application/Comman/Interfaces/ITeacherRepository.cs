using EduVision.Application.Features.Teacher.Queries.GetClassStudents;
using EduVision.Application.Features.Teacher.Queries.GetCourses;
using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface ITeacherRepository
{
    Task<List<GetCoursesResponse>> GetCoursesAsync(Guid teacherId, CancellationToken cancellationToken = default);
    Task<List<GetClassStudentsResponse>> GetClassStudentsAsync(Guid classroomCourseId, CancellationToken cancellationToken = default);
}
