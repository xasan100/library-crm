import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { StudentsCrud } from "../slice/students/students.js";
import { TeachersCrud } from "../slice/teachers/TeachersSlice.js";
import { StaffCrud } from "../slice/staff/StaffSlice.js";
import { SciencesCrud } from "../slice/sciences/SciencesSlice.js";
import { AttendanceCrud } from "../slice/attandance/Attendance.js";
import { UserCrud } from "../slice/user/user.js";
import { TypeAdmin } from "../slice/user/typeAdmin.js";
import { permitionAdmin } from "../slice/user/permitio.js";
import { RoomsCrud } from "../slice/rooms/RoomsCrud.js";
import { TaskCrud } from "../slice/task/TaskCrud.js";
<<<<<<< HEAD
import { StudentsClasCrud } from "../slice/studentsClas/studentsClas.js";
import { ChatCrud } from "../slice/chat/ChatCrud.js";
import { ParentsCrud } from "../slice/parents/ParentsCrud.js";
=======
import { StudentsClasCrud } from "../slice/studentsClas/studentsClas.js"
import { generalStatisticsGet, TotalCrud } from "../slice/general/generalStatisca.js";
>>>>>>> 33aac934dcb71b763336880917674fddd2ef3adc

export const store = configureStore({
  reducer: {
    [TeachersCrud.reducerPath]: TeachersCrud.reducer,
    [StudentsCrud.reducerPath]: StudentsCrud.reducer,
    [StaffCrud.reducerPath]: StaffCrud.reducer,
    [SciencesCrud.reducerPath]: SciencesCrud.reducer,
    [AttendanceCrud.reducerPath]: AttendanceCrud.reducer,
    [UserCrud.reducerPath]: UserCrud.reducer,
    [TypeAdmin.reducerPath]: TypeAdmin.reducer,
    [permitionAdmin.reducerPath]: permitionAdmin.reducer,
    [RoomsCrud.reducerPath]: RoomsCrud.reducer,
    [TaskCrud.reducerPath]: TaskCrud.reducer,
    [StudentsClasCrud.reducerPath]: StudentsClasCrud.reducer,
<<<<<<< HEAD
    [ChatCrud.reducerPath]: ChatCrud.reducer,
    [ParentsCrud.reducerPath]: ParentsCrud.reducer,
=======
    [TotalCrud.reducerPath]: TotalCrud.reducer,
>>>>>>> 33aac934dcb71b763336880917674fddd2ef3adc
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      TeachersCrud.middleware,
      StudentsCrud.middleware,
      AttendanceCrud.middleware,
      UserCrud.middleware,
      SciencesCrud.middleware,
      StaffCrud.middleware,
      TypeAdmin.middleware,
      permitionAdmin.middleware,
      RoomsCrud.middleware,
      TaskCrud.middleware,
      StudentsClasCrud.middleware,
<<<<<<< HEAD
      ChatCrud.middleware,
      ParentsCrud.middleware
=======
      TotalCrud.middleware,
>>>>>>> 33aac934dcb71b763336880917674fddd2ef3adc
    ),
});

setupListeners(store.dispatch);
