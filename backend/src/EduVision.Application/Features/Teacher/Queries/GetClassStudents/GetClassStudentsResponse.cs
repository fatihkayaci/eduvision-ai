namespace EduVision.Application.Features.Teacher.Queries.GetClassStudents;

public sealed record GetClassStudentsResponse(
    Guid StudentId,
    string FirstName,
    string LastName,
    string StudentNumber,
    decimal? Average,
    int TotalAbsent,
    int TotalExcused);
