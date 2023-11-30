package com.example.demo;

import com.google.api.client.util.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.shell.standard.ShellMethod;
import java.util.List;

/**
 * Spring Boot application for managing game records.
 */
@SpringBootApplication
public class DemoApplication {

    @Autowired
    GameRecordRepository gameRecordRepository;

    /**
     * Main method to run the Spring Boot application.
     *
     * @param args Command line arguments.
     */
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    /**
     * Shell method to load and display all game records.
     *
     * @return String representation of all game records.
     */
    @ShellMethod("Load all game records")
    public String showAllRecords() {
        Iterable<GameRecord> gameRecords = this.gameRecordRepository.findAll();
        return Lists.newArrayList(gameRecords).toString();
    }

    /**
     * Shell method to load game records by a specific userId.
     *
     * @param userId The userId to filter the game records.
     * @return String representation of game records filtered by userId.
     */
    @ShellMethod("Loads game records by userId: find-by-userId <userId>")
    public String findByUserId(String userId){
        List<GameRecord> gameRecords = this.gameRecordRepository.findByUserId(userId);
        return gameRecords.toString();
    }

    /**
     * Shell method to delete game records by a specific userId.
     *
     * @param userId The userId for which the game records will be deleted.
     * @return Confirmation message of deletion.
     */
    @ShellMethod("Deletes game records by userId: delete-by-userId <userId>")
    public String deleteByUserId(String userId) {
        gameRecordRepository.deleteByUserId(userId);
        return "Deleted game records for userId: " + userId;
    }

    /**
     * Shell method to check if a handle is in use by another userId.
     *
     * @param handle The handle to check.
     * @param userId The userId to exclude from the check.
     * @return Message indicating if the handle is in use or available.
     */
    @ShellMethod("Check if a handle is in use by another userId: check-handle <handle> <userId>")
    public String checkHandle(String handle, String userId) {
        Iterable<GameRecord> allRecords = gameRecordRepository.findAll();
        for (GameRecord record : allRecords) {
            if (handle.equals(record.getHandle()) && !userId.equals(record.getUserId())) {
                return "Handle is in use by another user";
            }
        }
        return "Handle is available";
    }

    /**
     * Shell method to update a user's handle based on their userId.
     *
     * @param userId The userId for which the handle is to be updated.
     * @param newHandle The new handle to set.
     * @return Confirmation message of handle update.
     */
    @ShellMethod("Update user's handle by userId: update-handle <userId> <newHandle>")
    public String updateHandleByUserId(String userId, String newHandle) {
        List<GameRecord> recordsToUpdate = gameRecordRepository.findByUserId(userId);

        if (recordsToUpdate.isEmpty()) {
            return "No records found for userId: " + userId;
        }

        for (GameRecord record : recordsToUpdate) {
            record.setHandle(newHandle);
        }

        gameRecordRepository.saveAll(recordsToUpdate);
        return "Updated handle for userId: " + userId;
    }
}
