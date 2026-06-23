using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface IStudentRepository
{
    Task<StudentProfile?> GetProfileAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task<List<ClassroomCourse>> GetCoursesWithGradesAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task<List<Attendance>> GetAttendancesAsync(Guid studentId, CancellationToken cancellationToken = default);
}
