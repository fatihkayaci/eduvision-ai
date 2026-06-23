namespace EduVision.Application.Features.Student.Queries.GetStudentAssignments;

public sealed record GetStudentAssignmentsResponse(
    Guid Id,
    string Title,
    string? Description,
    string Type,
    string? FileUrl,
    DateOnly StartDate,
    DateOnly DueDate);
