import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar";
import MotifBawah from "../../assets/timeline/motifbesar.png";
import ikonfile from "../../assets/kumpultugas/kumpultugas.svg";
import { Toaster, toast } from "react-hot-toast";

const initialTasksData = [
  {
    id: 1,
    title: "Tugas 1",
    deadline: "Deadline 01 Agustus 2025 | 07:00",
    deadlineDate: new Date("2025-08-01T07:00:00"),
    description: "Tugas 1 adalah",
  },
  {
    id: 2,
    title: "Tugas 2",
    deadline: "Deadline 02 Agustus 2025 | 07:00",
    deadlineDate: new Date("2025-08-02T07:00:00"),
    description: "Tugas 2 adalah",
  },
  {
    id: 3,
    title: "Tugas 3",
    deadline: "Deadline 03 Agustus 2025 | 07:00",
    deadlineDate: new Date("2025-08-03T07:00:00"),
    description: "Tugas 3 adalah",
  },
];

const kelompokOptions = [
  "Kelompok 1",
  "Kelompok 2",
  "Kelompok 3",
  "Kelompok 4",
  "Kelompok 5",
  "Kelompok 6",
];

const StatusBadge = ({ status }) => {
  const statusInfo = {
    dikumpulkan: { text: "Sudah dikumpulkan", color: "bg-green-600" },
    terlambat: { text: "Terlambat", color: "bg-red-600" },
  };
  if (!statusInfo[status]) return null;
  return (
    <div
      className={`text-white text-xs font-bold px-3 py-1 rounded-full ${statusInfo[status].color}`}
    >
      {statusInfo[status].text}
    </div>
  );
};

const TaskModal = ({ task, onClose, onKumpulClick }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black/30 flex justify-center items-center z-50 p-4"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white p-8 rounded-2xl shadow-2xl relative border-2 border-[#623B1C] w-full max-w-4xl min-h-[500px] flex flex-col"
    >
      <h2 className="text-3xl font-bold text-center font-['Titan_One'] text-[#6d4c41]">
        {task.title}
      </h2>
      <hr className="border-t-2 border-[#a1887f] my-4" />
      <div className="font-[poppins] text-[#623B1C] mt-4 flex-grow">
        <p className="font-bold text-lg">Deskripsi Tugas :</p>
        <p className="mt-2 text-base">{task.description}</p>
      </div>
      <div className="flex justify-end mt-8">
        <button
          onClick={onKumpulClick}
          className="bg-[#6d4c41] text-white px-6 py-3 rounded-lg font-bold font-[poppins] text-sm hover:scale-105 transition-all cursor-pointer"
        >
          Kumpul Tugas
        </button>
      </div>
    </div>
  </div>
);

const SubmissionFormModal = ({ task, onClose, onBack, onTaskSubmit }) => {
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    kelompok: "",
    link: "",
  });
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.nama ||
      !formData.nim ||
      !formData.kelompok ||
      !formData.link
    ) {
      toast.error("Harap isi semua kolom!", {
        id: "single-error-toast",
        style: { background: "#6d4c41", color: "#fff" },
      });
      return;
    }
    onTaskSubmit(task.id, formData);
    toast.success(`Tugas '${task.title}' berhasil dikumpulkan.`, {
      duration: 4000,
      style: { background: "#6d4c41", color: "#fff" },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-[#ffff] p-8 rounded-2xl shadow-2xl relative border-2 border-[#623B1C] w-full max-w-4xl min-h-[500px]">
        <h2 className="text-3xl font-bold text-center font-['Titan_One'] text-[#6d4c41]">
          Kumpul Tugas
        </h2>
        <hr className="border-t-2 border-[#a1887f] my-4" />
        <form
          onSubmit={handleSubmit}
          className="space-y-5 font-[poppins] text-[#623B1C]"
        >
          <p className="text-lg font-bold">{task.title}</p>
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Nama"
            className="w-full bg-white border border-[#a1887f] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6d4c41]"
          />
          <input
            name="nim"
            value={formData.nim}
            onChange={handleChange}
            placeholder="NIM"
            className="w-full bg-white border border-[#a1887f] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6d4c41]"
          />
          <select
            name="kelompok"
            value={formData.kelompok}
            onChange={handleChange}
            className="w-full bg-white border border-[#a1887f] rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6d4c41]"
          >
            <option value="" disabled>
              Pilih Kelompok
            </option>
            {kelompokOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <input
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Link Tugas"
            className="w-full bg-white border border-[#a1887f] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6d4c41]"
          />
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={onBack}
              className="text-[#6d4c41] font-bold hover cursor-pointer"
            >
              &larr; Kembali
            </button>
            <button
              type="submit"
              className="bg-[#6d4c41] text-white px-8 py-3 rounded-lg font-bold text-sm hover:scale-105 transition-all cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Pengumpulantugas = () => {
  const [tasks, setTasks] = useState(initialTasksData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("submittedTasks") || "{}");
    if (Object.keys(saved).length > 0) {
      setTasks((tasks) =>
        tasks.map((task) => {
          if (saved[task.id]) {
            const now = new Date();
            const isLate = now > task.deadlineDate;
            return {
              ...task,
              submission: saved[task.id].submission,
              status: isLate ? "terlambat" : "dikumpulkan",
            };
          }
          return task;
        })
      );
    }
  }, []);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setShowSubmissionForm(false);
  };
  const handleCloseModal = () => setSelectedTask(null);
  const handleShowSubmissionForm = () => setShowSubmissionForm(true);
  const handleBackToDescription = () => setShowSubmissionForm(false);

  const handleTaskSubmit = (taskId, submissionData) => {
    const now = new Date();
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.id === taskId) {
          const isLate = now > task.deadlineDate;
          const saved = JSON.parse(
            localStorage.getItem("submittedTasks") || "{}"
          );
          saved[taskId] = { submission: submissionData };
          localStorage.setItem("submittedTasks", JSON.stringify(saved));
          return {
            ...task,
            submission: submissionData,
            status: isLate ? "terlambat" : "dikumpulkan",
          };
        }
        return task;
      })
    );
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <div className="bg-[#fcf8f0] min-h-screen font-sans flex justify-center items-center p-4">
        <main className="relative bg-[#f9f4e8] w-full max-w-7xl p-4 md:p-10 md:pt-32 pt-4 rounded-2xl shadow-lg border-2 border-[#623B1C] mt-15 md:mt-0">
          <div className="hidden md:block absolute -top-16 left-1/2 -translate-x-1/2 z-20 text-center w-full px-4">
            <div className="bg-[#6d4c41] text-white inline-block px-10 py-4 rounded-2xl w-full max-w-xl">
              <h1 className="font-['Titan_One'] text-3xl md:text-4xl">
                TUGAS BAKTI
              </h1>
              <p className="font-bold font-[Poppins] -mt-1">
                Kumpulkan tugas tepat waktu!
              </p>
            </div>
          </div>

          {/* Layout terpisah: Desktop & Mobile */}
          <div className="relative z-10 flex flex-col gap-5">
            {/* Desktop */}
            <div className="hidden md:flex flex-col gap-5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#6d4c41] text-white flex flex-row justify-between items-center px-6 py-5 rounded-2xl"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={ikonfile}
                      alt="Ikon Tugas"
                      className="w-10 h-10"
                    />
                    <h3 className="text-xl font-bold font-[poppins]">
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <p className="text-sm text-[#d7ccc8] font-[poppins]">
                      {task.deadline}
                    </p>
                    {task.status && <StatusBadge status={task.status} />}
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-300 transition-all cursor-pointer hover:scale-105"
                    >
                      {task.submission ? "Tambah File" : "Lihat Tugas"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile */}
            <div className="md:hidden flex flex-col gap-5 relative z-10 mt-2">
              {/* Judul & subtitle */}
              <div className="bg-[#8d6e63] text-white inline-block px-6 py-3 rounded-xl w-full max-w-sm mx-auto text-center">
                <h1 className="font-['Titan_One'] text-2xl">Tugas Bakti</h1>
                <p className="font-semibold font-[Poppins] -mt-1 text-xs">
                  Tugas jangan lupa dikumpul ya!
                </p>
              </div>

              {/* Card tugas */}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#8d6e63] text-white flex flex-col px-4 py-4 rounded-2xl space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <img src={ikonfile} alt="Ikon Tugas" className="w-8 h-8" />
                    <h3 className="text-lg font-bold font-[poppins]">
                      {task.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#d7ccc8] font-[poppins]">
                    {task.deadline}
                  </p>
                  <div className="flex gap-2 items-center justify-end">
                    {task.status && <StatusBadge status={task.status} />}
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold text-xs hover:bg-gray-300 transition-all cursor-pointer hover:scale-105"
                    >
                      {task.submission ? "Tambah File" : "Lihat Tugas"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <img
            src={MotifBawah}
            alt="Decorative Pattern"
            className="hidden md:block absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 opacity-40"
          />
        </main>
      </div>
      {selectedTask && !showSubmissionForm && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onKumpulClick={handleShowSubmissionForm}
        />
      )}
      {selectedTask && showSubmissionForm && (
        <SubmissionFormModal
          task={selectedTask}
          onClose={handleCloseModal}
          onBack={handleBackToDescription}
          onTaskSubmit={handleTaskSubmit}
        />
      )}
    </div>
  );
};

export default Pengumpulantugas;
