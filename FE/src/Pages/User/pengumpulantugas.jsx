import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../component/Navbar";
import ikonfile from "../../assets/kumpultugas/kumpultugas.svg";
import { Toaster, toast } from "react-hot-toast";
import { getTugasList, submitTugas, editKumpulTugas } from "../../utils/tugasApi";
import { getKelompokList } from "../../utils/kelompokApi";
import { jwtDecode } from "jwt-decode";

// Dummy data kelompokList untuk development/testing
const dummyKelompokList = [
  { id: 1, nomor: 1 },
  { id: 2, nomor: 2 },
  { id: 3, nomor: 3 },
  { id: 4, nomor: 4 },
  { id: 5, nomor: 5 },
  { id: 6, nomor: 6 }
];

// Helper untuk memformat tanggal deadline
const formatDeadline = (date) => {
  if (!date) return "-";
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const d = new Date(date);
  const tgl = d.getDate();
  const bln = bulan[d.getMonth()];
  const thn = d.getFullYear();
  const jam = d.getHours().toString().padStart(2, "0");
  const menit = d.getMinutes().toString().padStart(2, "0");
  return `${tgl} ${bln} ${thn} pukul ${jam}:${menit}`;
};

// Komponen Modal untuk menampilkan detail tugas
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

// Komponen Modal untuk form pengumpulan tugas
const SubmissionFormModal = ({ task, onClose, onBack, onTaskSubmit, kelompokList }) => {
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    kelompok: "",
    link: "",
  });
  
  let deadlineWIB = null;
  if (task.deadlineDate) {
    deadlineWIB = new Date(task.deadlineDate);
    deadlineWIB.setHours(deadlineWIB.getHours() + 7);
  }
  
  const deadlinePassed = task.deadlineDate && new Date() > new Date(task.deadlineDate);

  useEffect(() => {
    if (task && task.hasSubmitted) {
      setFormData({
        nama: task.Kumpul_Tugas?.[0]?.nama || "",
        nim: task.Kumpul_Tugas?.[0]?.nim || "",
        kelompok: task.Kumpul_Tugas?.[0]?.id_kelompok?.toString() || "",
        link: task.Kumpul_Tugas?.[0]?.link_tugas || "",
      });
    }
  }, [task]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (deadlinePassed) {
      toast.error("Tugas sudah melewati deadline!", {
        id: "late-error-toast",
        style: { background: "#6d4c41", color: "#fff" },
      });
      return;
    }
    if (!formData.nama || !formData.nim || !formData.kelompok || !formData.link) {
      toast.error("Harap isi semua kolom!", {
        id: "single-error-toast",
        style: { background: "#6d4c41", color: "#fff" },
      });
      return;
    }
    if (task.editMode && task.Kumpul_Tugas?.[0]?.id) {
      onTaskSubmit(task.id, formData, true, task.Kumpul_Tugas[0].id);
    } else {
      onTaskSubmit(task.id, formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-[#ffff] p-8 rounded-2xl shadow-2xl relative border-2 border-[#623B1C] w-full max-w-4xl min-h-[500px]">
        <h2 className="text-3xl font-bold text-center font-['Titan_One'] text-[#6d4c41]">
          Kumpul Tugas
        </h2>
        <hr className="border-t-2 border-[#a1887f] my-4" />
        <form onSubmit={handleSubmit} className="space-y-5 font-[poppins] text-[#623B1C]">
          <p className="text-lg font-bold">{task.title}</p>
          <p className="text-sm text-[#a1887f]">Deadline: {formatDeadline(task.deadlineDate)}</p>
          {deadlinePassed && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 font-bold">Terlambat! Tugas sudah melewati deadline.</div>
          )}
          <input name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama" className="w-full bg-white border border-[#a1887f] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6d4c41]" disabled={deadlinePassed} />
          <input name="nim" value={formData.nim} onChange={handleChange} placeholder="NIM" className="w-full bg-white border border-[#a1887f] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6d4c41]" disabled={deadlinePassed} />
          <select name="kelompok" value={formData.kelompok} onChange={handleChange} className="w-full bg-white border border-[#a1887f] rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6d4c41]" disabled={deadlinePassed}>
            <option value="" disabled>Pilih Kelompok</option>
            {kelompokList && kelompokList.length > 0 ? (
              kelompokList.map((opt) => (<option key={opt.id} value={opt.id}>Kelompok {opt.nomor}</option>))
            ) : (
              <option value="" disabled>Tidak ada kelompok</option>
            )}
          </select>
          <input name="link" value={formData.link} onChange={handleChange} placeholder="Link Tugas" className="w-full bg-white border border-[#a1887f] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#6d4c41]" disabled={deadlinePassed} />
          <div className="flex justify-between items-center pt-4">
            <button type="button" onClick={onBack} className="text-[#6d4c41] font-bold hover cursor-pointer">&larr; Kembali</button>
            <button type="submit" className="bg-[#6d4c41] text-white px-8 py-3 rounded-lg font-bold text-sm hover:scale-105 transition-all cursor-pointer" disabled={deadlinePassed}>
              {task.editMode ? "Edit Tugas" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Komponen Utama
export const Pengumpulantugas = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kelompokList, setKelompokList] = useState(dummyKelompokList);
  const [userId, setUserId] = useState(null);

  // 1. useEffect untuk mendapatkan userId dari token saat komponen pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (e) {
        console.error("Invalid token:", e);
        setUserId(null);
      }
    } else {
        setLoading(false);
    }
  }, []);

  // 2. useEffect untuk mengambil data tugas dan kelompok, dijalankan setelah userId didapatkan
  useEffect(() => {
    if (!userId) {
        if (!localStorage.getItem("authToken")) setLoading(false);
        return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      setError("");
      
      const [tugasResult, kelompokResult] = await Promise.all([
        getTugasList(),
        getKelompokList()
      ]);

      if (tugasResult.success) {
        const processedTasks = tugasResult.data.map((t) => {
          const userSubmission = t.Kumpul_Tugas.find(sub => sub.id_user === userId);
          const hasSubmitted = !!userSubmission;
          return {
            id: t.id,
            title: t.title,
            deadline: t.deadline ? formatDeadline(t.deadline) : "-",
            deadlineDate: t.deadline ? new Date(t.deadline) : null,
            description: t.description || "",
            hasSubmitted,
            Kumpul_Tugas: userSubmission ? [userSubmission] : [],
          };
        });
        setTasks(processedTasks);
      } else {
        setError(tugasResult.error || "Gagal memuat tugas");
      }

      // Jika ingin fetch dari backend, bisa gunakan useEffect seperti sebelumnya
      // useEffect(() => { setKelompokList(dummyKelompokList); }, []);

      setLoading(false);
    };

    fetchAllData();
  }, [userId]);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setShowSubmissionForm(false);
  };
  const handleCloseModal = () => setSelectedTask(null);
  const handleShowSubmissionForm = () => setShowSubmissionForm(true);
  const handleBackToDescription = () => setShowSubmissionForm(false);

  const handleTaskSubmit = async (taskId, submissionData, isEdit = false, kumpulId = null) => {
    if (!userId) {
      toast.error("Sesi Anda telah berakhir, silakan login kembali.", {
        style: { background: "#6d4c41", color: "#fff" },
      });
      return;
    }

    try {
      const payload = {
        id_user: userId,
        id_tugas: taskId,
        nama: submissionData.nama,
        nim: submissionData.nim,
        kelompok: parseInt(submissionData.kelompok),
        link_tugas: submissionData.link,
      };
      let result;
      if (isEdit && kumpulId) {
        result = await editKumpulTugas({ ...payload, id: kumpulId });
      } else {
        result = await submitTugas(payload);
      }
      if (result.success) {
        toast.success(isEdit ? "Tugas berhasil diedit!" : "Tugas berhasil dikumpulkan!", {
          duration: 4000,
          style: { background: "#6d4c41", color: "#fff" },
        });
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, hasSubmitted: true } : task
          )
        );
      } else {
        toast.error(result.error || (isEdit ? "Gagal mengedit tugas." : "Gagal mengumpulkan tugas."), {
          duration: 4000,
          style: { background: "#6d4c41", color: "#fff" },
        });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi ke server.", {
        duration: 4000,
        style: { background: "#6d4c41", color: "#fff" },
      });
    }
  };

  const handleEditSubmission = (task) => {
    setSelectedTask({ ...task, editMode: true });
    setShowSubmissionForm(true);
  };

  const isLate = (task) => {
    if (!task.deadlineDate) return false;
    return new Date() > new Date(task.deadlineDate);
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <div className="bg-[#fcf8f0] min-h-screen font-sans flex justify-center items-center p-4">
       <main className="relative bg-[#f9f4e8] w-full max-w-7xl p-8 pt-20 md:p-12 md:pt-28 rounded-2xl shadow-lg border-2 border-[#623B1C] mt-24 md:mt-32">

          {/* Header yang di-absolute positioned */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 text-center w-full px-4">
            <div className="bg-[#6d4c41] text-white inline-block px-8 py-4 rounded-2xl max-w-xl mx-auto">
              <h1 className="font-['Titan_One'] text-2xl md:text-4xl">TUGAS BAKTI</h1>
              <p className="font-bold font-[Poppins] text-sm md:text-base -mt-1">Kumpulkan tugas tepat waktu!</p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-5 mt-8">
            {/* Desktop View */}
            <div className="hidden md:flex flex-col gap-5">
              {loading ? (
                <p className="text-center text-gray-500 py-10">Memuat tugas...</p>
              ) : error ? (
                <p className="text-center text-red-500 py-10">{error}</p>
              ) : tasks.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Belum ada tugas yang tersedia.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="bg-[#6d4c41] text-white flex flex-row justify-between items-center px-6 py-5 rounded-2xl">
                    <div className="flex items-center gap-5">
                      <img src={ikonfile} alt="Ikon Tugas" className="w-10 h-10" />
                      <h3 className="text-xl font-bold font-[poppins]">{task.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <p className="text-sm text-[#d7ccc8] font-[poppins]">{task.deadline}</p>
                      <button
                        onClick={() => {
                          if (!task.hasSubmitted && !isLate(task)) {
                            handleOpenModal(task);
                          } else if (task.hasSubmitted && !isLate(task)) {
                            handleEditSubmission(task);
                          }
                        }}
                        className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                          task.hasSubmitted && !isLate(task)
                            ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 cursor-pointer'
                            : task.hasSubmitted && isLate(task)
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : isLate(task)
                                ? 'bg-red-500 text-white cursor-not-allowed'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:scale-105 cursor-pointer'
                        }`}
                        disabled={task.hasSubmitted && isLate(task) || isLate(task)}
                      >
                        {task.hasSubmitted && !isLate(task)
                          ? 'Edit Tugas'
                          : task.hasSubmitted && isLate(task)
                            ? 'Sudah Dikumpulkan'
                            : isLate(task)
                              ? 'Terlambat'
                              : 'Lihat Tugas'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col gap-5 relative z-10">
              {loading ? (
                <p className="text-center text-gray-500">Memuat tugas...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : tasks.length === 0 ? (
                <p className="text-center text-gray-500">Belum ada tugas.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="bg-[#8d6e63] text-white flex flex-col px-4 py-4 rounded-2xl space-y-3">
                    <div className="flex items-center gap-4">
                      <img src={ikonfile} alt="Ikon Tugas" className="w-8 h-8" />
                      <h3 className="text-lg font-bold font-[poppins]">{task.title}</h3>
                    </div>
                    <p className="text-sm text-[#d7ccc8] font-[poppins]">{task.deadline}</p>
                    <div className="flex gap-2 items-center justify-end">
                      <button
                        onClick={() => {
                          if (!task.hasSubmitted && !isLate(task)) {
                            handleOpenModal(task);
                          } else if (task.hasSubmitted && !isLate(task)) {
                            handleEditSubmission(task);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                          task.hasSubmitted && !isLate(task)
                            ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 cursor-pointer'
                            : task.hasSubmitted && isLate(task)
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : isLate(task)
                                ? 'bg-red-500 text-white cursor-not-allowed'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer'
                        }`}
                        disabled={task.hasSubmitted && isLate(task) || isLate(task)}
                      >
                        {task.hasSubmitted && !isLate(task)
                          ? 'Edit Tugas'
                          : task.hasSubmitted && isLate(task)
                            ? 'Sudah Dikumpulkan'
                            : isLate(task)
                              ? 'Terlambat'
                              : 'Lihat Tugas'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
      
      {selectedTask && !showSubmissionForm && (
        <TaskModal task={selectedTask} onClose={handleCloseModal} onKumpulClick={handleShowSubmissionForm} />
      )}
      {selectedTask && showSubmissionForm && (
        <SubmissionFormModal task={selectedTask} onClose={handleCloseModal} onBack={handleBackToDescription} onTaskSubmit={handleTaskSubmit} kelompokList={kelompokList} />
      )}
    </div>
  );
};

export default Pengumpulantugas;