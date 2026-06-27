namespace EduVision.Application.Features.Teacher.Queries.GetCourses;

public sealed record GetCoursesResponse(
    Guid ClassroomCourseId,
    string CourseName,
    int GradeLevel,
    string Section,
    int StudentCount,
    decimal? Average);
