namespace Quizzik_Project.DTO
{
    public class QuestionWithOptionsDTO
    {
        public int QuestionID { get; set; }
        public string? QuestionText { get; set; }
        public Dictionary<int, string>? Options { get; set; }
        public int QuizID { get; set; }
        public int UserID { get; set; }
        public string? QuizTitle { get; set; }
        public string? QuizDescription { get; set; }
        public string? DifficultyLevel { get; set; }
        public string? CorrectAnswer { get; set; }
    }
}
