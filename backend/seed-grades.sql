-- Mehmet'in userId'sini bul
DECLARE @StudentId UNIQUEIDENTIFIER = (
    SELECT Id FROM Users WHERE FirstName = 'Mehmet' AND LastName = 'Demir'
);

-- 9-A sınıfındaki Matematik dersinin ClassroomCourseId'sini bul
DECLARE @ClassroomCourseId UNIQUEIDENTIFIER = (
    SELECT cc.Id
    FROM ClassroomCourses cc
    INNER JOIN ClassRooms cr ON cc.ClassRoomId = cr.Id
    INNER JOIN Courses c ON cc.CourseId = c.Id
    WHERE cr.GradeLevel = 9 AND cr.Section = 'A' AND c.Name = 'Matematik'
);

-- Daha önce eklenmemişse Grade'leri ekle
IF NOT EXISTS (SELECT 1 FROM Grades WHERE StudentId = @StudentId AND ClassroomCourseId = @ClassroomCourseId)
BEGIN
    INSERT INTO Grades (Id, StudentId, ClassroomCourseId, Value, ExamType, Date, CreatedAtUtc)
    VALUES
        (NEWID(), @StudentId, @ClassroomCourseId, 85.00, 'Exam',     '2026-03-15', GETUTCDATE()),
        (NEWID(), @StudentId, @ClassroomCourseId, 72.50, 'Homework', '2026-04-10', GETUTCDATE()),
        (NEWID(), @StudentId, @ClassroomCourseId, 90.00, 'Project',  '2026-05-20', GETUTCDATE());
END
