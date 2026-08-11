<template>
    <div class="card-front">
        <!-- Phân này có nhiệm vụ Gợi ý từ vựng cần học -->
        <div class="card-front__hint"></div> 
        <!-- Phần này thực hiện nhiệm vụ luyện tập từ vựng -->
        <div class="card-front__practice"></div>
    </div>
</template>

<style lang="scss" scoped>
.card-front {
    width: 80%;
    padding: 10px;
    margin-top: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    background-color: rgb(249, 252, 252);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
    
    // Tạo khoảng cách giữa các khối con theo chiều dọc.
    display: flex;
    flex-direction: column;
    gap: 30px;
    


    &__hint {
        height: 50px;
        width: 100%;
        background-color: #c9c6c6;
    }

    &__practice {
        height: 50px;
        width: 100%;
        background-color: #4f9966;
    }
}
</style> 