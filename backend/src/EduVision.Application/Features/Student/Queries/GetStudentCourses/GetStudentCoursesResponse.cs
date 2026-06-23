namespace EduVision.Application.Features.Student.Queries.GetStudentCourses;

public sealed record GetStudentCoursesResponse(
    Guid ClassroomCourseId,
    string CourseName,
    List<GradeResponse> Grades);

public sealed record GradeResponse(
    decimal Value,
    string ExamType,
    DateOnly Date);
