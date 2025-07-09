// Enterprise Java Spring Boot microservice for DeFiVerse
// Handles wallet operations, user management, and API endpoints

package com.defiverse.wallet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Email;
import java.time.LocalDateTime;
import java.util.*;
import java.math.BigDecimal;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@SpringBootApplication
public class DeFiVerseApplication {
    public static void main(String[] args) {
        System.out.println("🚀 Starting DeFiVerse Java Backend...");
        SpringApplication.run(DeFiVerseApplication.class, args);
    }
}

// User Entity
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(unique = true)
    private String username;
    
    @Email
    @NotNull
    @Column(unique = true)
    private String email;
    
    @NotNull
    private String passwordHash;
    
    @NotNull
    @Column(unique = true)
    private String walletAddress;
    
    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastLogin;
    private boolean isActive = true;
    
    // Constructors, getters, setters
    public User() {}
    
    public User(String username, String email, String passwordHash, String walletAddress) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.walletAddress = walletAddress;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}

enum UserRole {
    USER, ADMIN, MODERATOR
}

// Wallet Balance Entity
@Entity
@Table(name = "wallet_balances")
public class WalletBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    private String walletAddress;
    
    @NotNull
    private String tokenSymbol;
    
    @NotNull
    @Column(precision = 36, scale = 18)
    private BigDecimal balance;
    
    private LocalDateTime lastUpdated = LocalDateTime.now();
    
    // Constructors, getters, setters
    public WalletBalance() {}
    
    public WalletBalance(String walletAddress, String tokenSymbol, BigDecimal balance) {
        this.walletAddress = walletAddress;
        this.tokenSymbol = tokenSymbol;
        this.balance = balance;
    }
    
    public Long getId() { return id; }
    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }
    
    public String getTokenSymbol() { return tokenSymbol; }
    public void setTokenSymbol(String tokenSymbol) { this.tokenSymbol = tokenSymbol; }
    
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { 
        this.balance = balance;
        this.lastUpdated = LocalDateTime.now();
    }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
}

// Transaction Entity
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    private String id;
    
    @NotNull
    private String fromAddress;
    
    @NotNull
    private String toAddress;
    
    @NotNull
    @Column(precision = 36, scale = 18)
    private BigDecimal amount;
    
    @NotNull
    private String tokenSymbol;
    
    @Column(precision = 36, scale = 18)
    private BigDecimal gasFee;
    
    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.PENDING;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime confirmedAt;
    
    private String blockHash;
    private Long blockNumber;
    
    // Constructors, getters, setters
    public Transaction() {}
    
    public Transaction(String id, String fromAddress, String toAddress, 
                      BigDecimal amount, String tokenSymbol, BigDecimal gasFee) {
        this.id = id;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.tokenSymbol = tokenSymbol;
        this.gasFee = gasFee;
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getFromAddress() { return fromAddress; }
    public void setFromAddress(String fromAddress) { this.fromAddress = fromAddress; }
    
    public String getToAddress() { return toAddress; }
    public void setToAddress(String toAddress) { this.toAddress = toAddress; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getTokenSymbol() { return tokenSymbol; }
    public void setTokenSymbol(String tokenSymbol) { this.tokenSymbol = tokenSymbol; }
    
    public BigDecimal getGasFee() { return gasFee; }
    public void setGasFee(BigDecimal gasFee) { this.gasFee = gasFee; }
    
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { 
        this.status = status;
        if (status == TransactionStatus.CONFIRMED) {
            this.confirmedAt = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    
    public String getBlockHash() { return blockHash; }
    public void setBlockHash(String blockHash) { this.blockHash = blockHash; }
    
    public Long getBlockNumber() { return blockNumber; }
    public void setBlockNumber(Long blockNumber) { this.blockNumber = blockNumber; }
}

enum TransactionStatus {
    PENDING, CONFIRMED, FAILED, CANCELLED
}

// Repository Interfaces
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByWalletAddress(String walletAddress);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :date")
    long countUsersCreatedAfter(LocalDateTime date);
}

@Repository
public interface WalletBalanceRepository extends JpaRepository<WalletBalance, Long> {
    List<WalletBalance> findByWalletAddress(String walletAddress);
    Optional<WalletBalance> findByWalletAddressAndTokenSymbol(String walletAddress, String tokenSymbol);
    
    @Query("SELECT SUM(wb.balance) FROM WalletBalance wb WHERE wb.tokenSymbol = :tokenSymbol")
    BigDecimal getTotalSupplyByToken(String tokenSymbol);
}

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByFromAddressOrToAddressOrderByCreatedAtDesc(String fromAddress, String toAddress);
    List<Transaction> findByStatusOrderByCreatedAtDesc(TransactionStatus status);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.createdAt >= :date AND t.status = 'CONFIRMED'")
    long countConfirmedTransactionsAfter(LocalDateTime date);
}

// DTOs for API requests/responses
public class TransferRequest {
    @NotNull
    private String fromAddress;
    
    @NotNull
    private String toAddress;
    
    @NotNull
    private BigDecimal amount;
    
    @NotNull
    private String tokenSymbol;
    
    private String password;
    
    // Constructors, getters, setters
    public TransferRequest() {}
    
    public String getFromAddress() { return fromAddress; }
    public void setFromAddress(String fromAddress) { this.fromAddress = fromAddress; }
    
    public String getToAddress() { return toAddress; }
    public void setToAddress(String toAddress) { this.toAddress = toAddress; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getTokenSymbol() { return tokenSymbol; }
    public void setTokenSymbol(String tokenSymbol) { this.tokenSymbol = tokenSymbol; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

public class TransactionResult {
    private String transactionId;
    private TransactionStatus status;
    private String message;
    private LocalDateTime timestamp;
    
    public TransactionResult(String transactionId, TransactionStatus status, String message) {
        this.transactionId = transactionId;
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getTransactionId() { return transactionId; }
    public TransactionStatus getStatus() { return status; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

// Service Layer
@Service
@Transactional
public class WalletService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WalletBalanceRepository walletBalanceRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final Map<String, BigDecimal> tokenPrices = new ConcurrentHashMap<>();
    
    public WalletService() {
        // Initialize token prices
        tokenPrices.put("BTC", new BigDecimal("45000"));
        tokenPrices.put("ETH", new BigDecimal("3200"));
        tokenPrices.put("USDT", new BigDecimal("1"));
        tokenPrices.put("BANK", new BigDecimal("25"));
        tokenPrices.put("GOV", new BigDecimal("15"));
    }
    
    public List<WalletBalance> getWalletBalances(String walletAddress) {
        return walletBalanceRepository.findByWalletAddress(walletAddress);
    }
    
    public BigDecimal getTokenBalance(String walletAddress, String tokenSymbol) {
        return walletBalanceRepository.findByWalletAddressAndTokenSymbol(walletAddress, tokenSymbol)
                .map(WalletBalance::getBalance)
                .orElse(BigDecimal.ZERO);
    }
    
    @Transactional
    public CompletableFuture<TransactionResult> processTransfer(TransferRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Validate request
                validateTransferRequest(request);
                
                // Check sender balance
                BigDecimal senderBalance = getTokenBalance(request.getFromAddress(), request.getTokenSymbol());
                if (senderBalance.compareTo(request.getAmount()) < 0) {
                    return new TransactionResult(null, TransactionStatus.FAILED, "Insufficient balance");
                }
                
                // Generate transaction ID
                String transactionId = UUID.randomUUID().toString();
                
                // Create transaction record
                Transaction transaction = new Transaction(
                    transactionId,
                    request.getFromAddress(),
                    request.getToAddress(),
                    request.getAmount(),
                    request.getTokenSymbol(),
                    calculateGasFee(request.getAmount(), request.getTokenSymbol())
                );
                
                // Update balances atomically
                updateBalance(request.getFromAddress(), request.getTokenSymbol(), 
                            senderBalance.subtract(request.getAmount()));
                
                BigDecimal receiverBalance = getTokenBalance(request.getToAddress(), request.getTokenSymbol());
                updateBalance(request.getToAddress(), request.getTokenSymbol(), 
                            receiverBalance.add(request.getAmount()));
                
                // Confirm transaction
                transaction.setStatus(TransactionStatus.CONFIRMED);
                transaction.setBlockHash(generateBlockHash());
                transaction.setBlockNumber(getNextBlockNumber());
                
                transactionRepository.save(transaction);
                
                System.out.println("✅ Transfer completed: " + transactionId);
                return new TransactionResult(transactionId, TransactionStatus.CONFIRMED, "Transfer successful");
                
            } catch (Exception e) {
                System.err.println("❌ Transfer failed: " + e.getMessage());
                return new TransactionResult(null, TransactionStatus.FAILED, e.getMessage());
            }
        });
    }
    
    private void validateTransferRequest(TransferRequest request) {
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        
        if (request.getFromAddress().equals(request.getToAddress())) {
            throw new IllegalArgumentException("Cannot transfer to same address");
        }
        
        if (!tokenPrices.containsKey(request.getTokenSymbol())) {
            throw new IllegalArgumentException("Unsupported token: " + request.getTokenSymbol());
        }
    }
    
    private void updateBalance(String walletAddress, String tokenSymbol, BigDecimal newBalance) {
        WalletBalance balance = walletBalanceRepository
                .findByWalletAddressAndTokenSymbol(walletAddress, tokenSymbol)
                .orElse(new WalletBalance(walletAddress, tokenSymbol, BigDecimal.ZERO));
        
        balance.setBalance(newBalance);
        walletBalanceRepository.save(balance);
    }
    
    private BigDecimal calculateGasFee(BigDecimal amount, String tokenSymbol) {
        // Simple gas fee calculation - 0.1% of transaction amount
        return amount.multiply(new BigDecimal("0.001"));
    }
    
    private String generateBlockHash() {
        return "0x" + UUID.randomUUID().toString().replace("-", "");
    }
    
    private Long getNextBlockNumber() {
        return System.currentTimeMillis() / 1000; // Simple block number based on timestamp
    }
    
    public Map<String, Object> getWalletSummary(String walletAddress) {
        List<WalletBalance> balances = getWalletBalances(walletAddress);
        BigDecimal totalValue = BigDecimal.ZERO;
        
        Map<String, Object> summary = new HashMap<>();
        List<Map<String, Object>> tokenBalances = new ArrayList<>();
        
        for (WalletBalance balance : balances) {
            BigDecimal tokenPrice = tokenPrices.get(balance.getTokenSymbol());
            BigDecimal tokenValue = balance.getBalance().multiply(tokenPrice);
            totalValue = totalValue.add(tokenValue);
            
            Map<String, Object> tokenInfo = new HashMap<>();
            tokenInfo.put("symbol", balance.getTokenSymbol());
            tokenInfo.put("balance", balance.getBalance());
            tokenInfo.put("price", tokenPrice);
            tokenInfo.put("value", tokenValue);
            tokenInfo.put("lastUpdated", balance.getLastUpdated());
            
            tokenBalances.add(tokenInfo);
        }
        
        summary.put("walletAddress", walletAddress);
        summary.put("totalValue", totalValue);
        summary.put("tokenBalances", tokenBalances);
        summary.put("lastUpdated", LocalDateTime.now());
        
        return summary;
    }
    
    public List<Transaction> getTransactionHistory(String walletAddress, int limit) {
        return transactionRepository
                .findByFromAddressOrToAddressOrderByCreatedAtDesc(walletAddress, walletAddress)
                .stream()
                .limit(limit)
                .toList();
    }
}

// REST Controller
@RestController
@RequestMapping("/api/v1/wallet")
@CrossOrigin(origins = "*")
public class WalletController {
    
    @Autowired
    private WalletService walletService;
    
    @GetMapping("/balance/{address}")
    public ResponseEntity<Map<String, Object>> getWalletSummary(@PathVariable String address) {
        try {
            Map<String, Object> summary = walletService.getWalletSummary(address);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/transfer")
    public CompletableFuture<ResponseEntity<TransactionResult>> transfer(@RequestBody TransferRequest request) {
        return walletService.processTransfer(request)
                .thenApply(result -> {
                    if (result.getStatus() == TransactionStatus.CONFIRMED) {
                        return ResponseEntity.ok(result);
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
                    }
                });
    }
    
    @GetMapping("/transactions/{address}")
    public ResponseEntity<List<Transaction>> getTransactionHistory(
            @PathVariable String address,
            @RequestParam(defaultValue = "50") int limit) {
        try {
            List<Transaction> transactions = walletService.getTransactionHistory(address, limit);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "DeFiVerse Wallet Service");
        health.put("version", "2.0.0");
        return ResponseEntity.ok(health);
    }
}

// Performance monitoring and metrics
@Service
public class MetricsService {
    private final Map<String, Long> counters = new ConcurrentHashMap<>();
    private final Map<String, Double> gauges = new ConcurrentHashMap<>();
    
    public void incrementCounter(String name) {
        counters.merge(name, 1L, Long::sum);
    }
    
    public void setGauge(String name, double value) {
        gauges.put(name, value);
    }
    
    public Map<String, Object> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("counters", counters);
        metrics.put("gauges", gauges);
        metrics.put("timestamp", LocalDateTime.now());
        return metrics;
    }
}
