package com.example.demo;
import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import org.springframework.data.annotation.Id;
import java.util.Date;

@Entity(name = "games")
public class GameRecord {
  @Id
  private Long id;
  private String userId;
  private String handle;
  private int score;
  private Date date;

  public GameRecord(String userId, String handle, int score) {
    this.userId = userId;
    this.handle = handle;
    this.score = score;
    this.date = new Date(); // Set the current date when the record is created
  }

  @Override
  public String toString() {
    return "GameRecord{" +
            "id=" + id +
            ", userId='" + userId + '\'' +
            ", handle='" + handle + '\'' +
            ", score=" + score +
            ", date=" + date +
            '}';
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public void setHandle(String handle) {
    this.handle = handle;
  }

  public void setScore(int score) {
    this.score = score;
  }

  public Long getId() {
    return id;
  }

  public String getUserId() {
    return userId;
  }

  public String getHandle() {
    return handle;
  }

  public int getScore() {
    return score;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }
}
