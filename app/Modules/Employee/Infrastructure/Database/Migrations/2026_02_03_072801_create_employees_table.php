<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('department');
            $table->string('position');
            $table->string('employment_type')->default('Full-time');
            $table->string('status')->default('Active');
            $table->date('start_date')->nullable();
            $table->string('location')->nullable();
            $table->decimal('salary', 15, 2)->nullable();
            $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->integer('annual_leave_balance')->default(12);
            $table->integer('sick_leave_balance')->default(10);
            $table->integer('personal_leave_balance')->default(5);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
