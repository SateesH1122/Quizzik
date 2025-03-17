namespace Quizzik_Project.DTO
{
    public class LeaderboardEntryDTO
    {
        public int AttemptID { get; set; }
        public int UserID { get; set; }
        public int QuizID { get; set; }
        public int Score { get; set; }
        public string Username { get; set; }
    }
}
