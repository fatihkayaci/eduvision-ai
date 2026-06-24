using EduVision.Domain.Entities;

namespace EduVision.Application.Comman.Interfaces;

public interface IStudentRepository
{
    Task<StudentProfile?> GetProfileAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task<List<ClassroomCourse>> GetCoursesWithGradesAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default);
    Task<List<Attendance>> GetAttendancesAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default);
    Task<List<Assignment>> GetAssignmentsAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default);
    Task<List<ClassSchedule>> GetScheduleAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default);
    Task<(int Rank, int TotalStudents)?> GetClassRankAsync(Guid studentId, Guid termId, CancellationToken cancellationToken = default);
}
