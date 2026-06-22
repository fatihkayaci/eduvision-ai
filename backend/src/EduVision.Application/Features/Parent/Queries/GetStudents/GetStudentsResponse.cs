namespace EduVision.Application.Features.Parent.Queries.GetStudents;

public sealed record GetStudentsResponse(
    Guid StudentId,
    string FirstName,
    string LastName);
