using EduVision.Application.Comman.Interfaces;
using EduVision.Domain.Enums;
using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentAttendances;

public sealed class GetStudentAttendancesQueryHandler(IStudentRepository studentRepository)
    : IRequestHandler<GetStudentAttendancesQuery, GetStudentAttendancesResponse>
{
    public async Task<GetStudentAttendancesResponse> Handle(GetStudentAttendancesQuery request, CancellationToken cancellationToken)
    {
        var records = await studentRepository.GetAttendancesAsync(request.StudentId, cancellationToken);

        var totalAbsent = records.Count(a => a.Type == AttendanceType.Absent);
        var totalExcused = records.Count(a => a.Type == AttendanceType.Excused);

        var recordResponses = records
            .Select(a => new AttendanceRecordResponse(a.Date, a.Type.ToString(), a.Note))
            .ToList();

        return new GetStudentAttendancesResponse(totalAbsent, totalExcused, recordResponses);
    }
}
