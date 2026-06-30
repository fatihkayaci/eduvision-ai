using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Teacher.Queries.GetSchedule;

public sealed class GetScheduleQueryHandler(ITeacherRepository teacherRepository)
    : IRequestHandler<GetScheduleQuery, List<GetScheduleResponse>>
{
    public async Task<List<GetScheduleResponse>> Handle(GetScheduleQuery request, CancellationToken cancellationToken)
    {
        return await teacherRepository.GetScheduleAsync(request.TeacherId, request.TermId, cancellationToken);
    }
}
