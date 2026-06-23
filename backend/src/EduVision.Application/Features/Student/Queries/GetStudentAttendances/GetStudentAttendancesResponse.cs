namespace EduVision.Application.Features.Student.Queries.GetStudentAttendances;

public sealed record GetStudentAttendancesResponse(
    int TotalAbsent,
    int TotalExcused,
    List<AttendanceRecordResponse> Records);

public sealed record AttendanceRecordResponse(
    DateOnly Date,
    string Type,
    string? Note);
