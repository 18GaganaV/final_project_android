package com.namma.pustaka.data

import androidx.room.*

@Entity(tableName = "books")
data class Book(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val author: String,
    val category: String,
    val imageResName: String
)

@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: String,
    val bookId: Int,
    val issueDate: Long,
    val dueDate: Long,
    val isReturned: Boolean = false
)

@Dao
interface LibraryDao {
    @Query("SELECT * FROM books")
    suspend fun getAllBooks(): List<Book>

    @Query("SELECT * FROM transactions WHERE studentId = :studentId AND isReturned = 0")
    suspend fun getActiveTransactions(studentId: String): List<Transaction>

    @Insert
    suspend fun insertTransaction(transaction: Transaction)

    @Insert
    suspend fun insertBooks(books: List<Book>)
}

@Database(entities = [Book::class, Transaction::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun libraryDao(): LibraryDao
}
