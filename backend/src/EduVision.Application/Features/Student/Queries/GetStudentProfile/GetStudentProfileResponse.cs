namespace EduVision.Application.Features.Student.Queries.GetStudentProfile;

public sealed record GetStudentProfileResponse(
    Guid StudentId,
    string FirstName,
    string LastName,
    string StudentNumber,
    string? Classroom);
