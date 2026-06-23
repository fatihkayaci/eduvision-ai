namespace EduVision.Application.Features.Student.Queries.GetStudentSchedule;

public sealed record GetStudentScheduleResponse(
    string CourseName,
    string Weekday,
    TimeOnly StartTime,
    TimeOnly EndTime);
