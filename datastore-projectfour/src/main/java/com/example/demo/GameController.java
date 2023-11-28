package com.example.demo;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class GameController {

  private final GameRecordRepository gameRecordRepository;

  public GameController(GameRecordRepository gameRecordRepository) {
    this.gameRecordRepository = gameRecordRepository;
  }

  @PostMapping("/addGameRecord")
  @CrossOrigin(origins = "*")
  public String addGameRecord(@RequestBody GameRecord gameRecord) {
    if (gameRecord == null) {
      return "The gameRecord is invalid";
    }
    this.gameRecordRepository.save(gameRecord);
    return "success";
  }

  @GetMapping("/findByUserId")
  @CrossOrigin(origins = "*")
  public List<GameRecord> findByUserId(@RequestParam String userId) {
    return gameRecordRepository.findByUserId(userId);
  }

  @GetMapping("/showAllRecords")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<GameRecord> showAllRecords() {
    Iterable<GameRecord> gameRecords = this.gameRecordRepository.findAll();
    List<GameRecord> recordList = new ArrayList<>();
    gameRecords.forEach(recordList::add);
    return recordList;
  }

  // Additional endpoints for updating a user's handle and deleting game records
  @DeleteMapping("/deleteByUserId")
  @CrossOrigin(origins = "*")
  public String deleteByUserId(@RequestParam String userId) {
    gameRecordRepository.deleteByUserId(userId);
    return "Deleted records for userId: " + userId;
  }

  @PutMapping("/updateHandleByUserId")
  @CrossOrigin(origins = "*")
  public String updateHandleByUserId(@RequestParam String userId, @RequestParam String newHandle) {
    List<GameRecord> recordsToUpdate = gameRecordRepository.findByUserId(userId);

    if (recordsToUpdate.isEmpty()) {
      return "No records found for userId: " + userId;
    }

    for (GameRecord record : recordsToUpdate) {
      record.setHandle(newHandle); // Assuming GameRecord has a setHandle method
    }

    gameRecordRepository.saveAll(recordsToUpdate);
    return "Updated handle for userId: " + userId;
  }

}