namespace EduVision.Application.Features.Teacher.Queries.GetSchedule;

public sealed record GetScheduleResponse(
    string CourseName,
    int GradeLevel,
    string Section,
    string Weekday,
    TimeOnly StartTime,
    TimeOnly EndTime);
