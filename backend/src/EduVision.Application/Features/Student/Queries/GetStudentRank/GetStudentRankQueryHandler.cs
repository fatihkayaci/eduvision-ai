using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentRank;

public sealed class GetStudentRankQueryHandler(IStudentRepository studentRepository)
    : IRequestHandler<GetStudentRankQuery, GetStudentRankResponse?>
{
    public async Task<GetStudentRankResponse?> Handle(GetStudentRankQuery request, CancellationToken cancellationToken)
    {
        var result = await studentRepository.GetClassRankAsync(request.StudentId, request.TermId, cancellationToken);

        if (result is null) return null;

        return new GetStudentRankResponse(result.Value.Rank, result.Value.TotalStudents);
    }
}
