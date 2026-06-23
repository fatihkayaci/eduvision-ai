namespace EduVision.Application.Features.Student.Queries.GetStudentProfile;

public sealed record GetStudentProfileResponse(
    string StudentNumber,
    string? Classroom);
