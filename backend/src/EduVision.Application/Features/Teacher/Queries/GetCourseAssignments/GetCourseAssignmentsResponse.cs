namespace EduVision.Application.Features.Teacher.Queries.GetCourseAssignments;

public sealed record GetCourseAssignmentsResponse(
    Guid AssignmentId,
    string Title,
    string Type,
    DateOnly DueDate);
