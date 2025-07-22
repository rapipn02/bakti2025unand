const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid");
const prisma = require("../prisma");

exports.AddTugas = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;

        const data = await prisma.Tugas.create({
            data: {
                title,
                description,
                deadline
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil menambahkan tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal menambahkan tugas",
                data
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.DeleteTugas = async (req, res) => {
    try {
        const id = req.query.id;

        const data = await prisma.Tugas.delete({
            where: {
                id
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil delete tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal delete tugas",
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.EditTugas = async (req, res) => {
    try {
        const { id, title, description, deadline } = req.body;
        console.log(req.body)

        const data = await prisma.Tugas.update({ where: { id }, data: { title, description, deadline: new Date(deadline) } })
        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Succesfully Edit Tugas",
                data
            })
        }
        return res.status(300).json({
            status: 300,
            message: "Failed Edit Tugas"
        })
    } catch (error) {
        console.log("Error in Edit Staff:", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetTugas = async (req, res) => {
    try {

        const data = await prisma.Tugas.findMany({
            include: {
                Kumpul_Tugas: true
            },
            orderBy: {
                deadline: "asc"
            }
        })

        if (data.length > 0) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil tugas",
                data
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: "Tugas tidak ditemukan",
                data
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

exports.GetKumpulTugas = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = 10;
        const skip = (page - 1) * limit
        if (page) {
            const data = await prisma.Kumpul_Tugas.findMany({
                take: limit,
                skip,
                // orderBy: {
                //     createAt: "desc"
                // },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    user: true,
                    tugas: true
                }
            })
            const totalItems = await prisma.Kumpul_Tugas.count()
            const totalPages = Math.ceil(totalItems / limit)

            if (data) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil kumpul tugas",
                    data,
                    currentPage: page,
                    totalPages
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Gagal mengambil kumpul tugas",
                })
            }
        }
        const data = await prisma.Kumpul_Tugas.findMany({
            // orderBy: {
            //     createAt: "desc"
            // },
            orderBy: {
                nim: "asc"
            },
            include: {
                user: true,
                tugas: true
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil kumpul tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal mengambil kumpul tugas",
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetKumpulTugasByKelompok = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = 10;
        const skip = (page - 1) * limit
        const kelompok = parseInt(req.query.kelompok);
        const tugas = req.query.tugas
        if (page) {
            const data = await prisma.Kumpul_Tugas.findMany({
                take: limit,
                skip,
                where: {
                    kelompok,
                    id_tugas: tugas
                },
                // orderBy: {
                //     createAt: "desc"
                // },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    user: true,
                    tugas: true
                }
            })
            const totalItems = await prisma.Kumpul_Tugas.count({
                where: {
                    kelompok,
                    id_tugas: tugas
                },
            })
            const totalPages = Math.ceil(totalItems / limit)

            if (data) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil kumpul tugas",
                    data,
                    currentPage: page,
                    totalPages
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Gagal mengambil kumpul tugas",
                })
            }
        }
        const data = await prisma.Kumpul_Tugas.findMany({
            where: {
                kelompok,
                id_tugas: tugas
            },
            // orderBy: {
            //     createAt: "desc"
            // },
            orderBy: {
                nim: "asc"
            },
            include: {
                user: true,
                tugas: true
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil kumpul tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal mengambil kumpul tugas",
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.SearchGetKumpulTugasByKelompok = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = 10;
        const skip = (page - 1) * limit
        const kelompok = parseInt(req.query.kelompok);
        const nama = req.query.nama;
        const nim = req.query.nim

        if (page) {
            let data = []
            let totalItems = 0
            if (nama) {
                data = await prisma.Kumpul_Tugas.findMany({
                    take: limit,
                    skip,
                    where: {
                        kelompok,
                        nama: {
                            contains: nama
                        }
                    },
                    orderBy: {
                        nim: "asc"
                    },
                    include: {
                        user: true,
                        tugas: true
                    }
                })
                totalItems = await prisma.Kumpul_Tugas.count({
                    where: {
                        kelompok,
                        nama: {
                            contains: nama
                        }
                    },
                })
            } else if (nim) {
                data = await prisma.Kumpul_Tugas.findMany({
                    take: limit,
                    skip,
                    where: {
                        kelompok,
                        nim: {
                            contains: nim
                        }
                    },
                    orderBy: {
                        nim: "asc"
                    },
                    include: {
                        user: true,
                        tugas: true
                    }
                })
                totalItems = await prisma.Kumpul_Tugas.count({
                    where: {
                        kelompok,
                        nama: {
                            contains: nama
                        }
                    },
                })
            }
            const totalPages = Math.ceil(totalItems / limit)

            if (data) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil kumpul tugas",
                    data,
                    currentPage: page,
                    totalPages
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Gagal mengambil kumpul tugas",
                })
            }
        }
        let data = []
        if (nama) {
            data = await prisma.Kumpul_Tugas.findMany({
                where: {
                    kelompok,
                    nama: {
                        contains: nama
                    }
                },
                // orderBy: {
                //     createAt: "desc"
                // },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    user: true,
                    tugas: true
                }
            })
        } else if (nim) {
            data = await prisma.Kumpul_Tugas.findMany({
                where: {
                    kelompok,
                    nim: {
                        contains: nim
                    }
                },
                // orderBy: {
                //     createAt: "desc"
                // },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    user: true,
                    tugas: true
                }
            })
        }

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil kumpul tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal mengambil kumpul tugas",
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

exports.KumpulTugas = async (req, res) => {
    try {
        const { id_user, id_tugas, nama, nim, kelompok, link_tugas } = req.body;

        // Cek apakah user sudah pernah mengumpulkan tugas ini sebelumnya
        const existingSubmission = await prisma.Kumpul_Tugas.findFirst({
            where: {
                id_user,
                id_tugas
            }
        });

        if (existingSubmission) {
            return res.status(409).json({ // 409 Conflict is a good status code for this
                status: 409,
                message: "Anda sudah pernah mengumpulkan tugas ini.",
            });
        }

        // Ambil data tugas untuk cek deadline
        const tugas = await prisma.Tugas.findUnique({ where: { id: id_tugas } });
        if (!tugas) {
            return res.status(404).json({
                status: 404,
                message: "Tugas tidak ditemukan."
            });
        }
        if (tugas.deadline && new Date() > new Date(tugas.deadline)) {
            return res.status(400).json({
                status: 400,
                message: "Pengumpulan tugas sudah melewati deadline. Tidak dapat submit lagi."
            });
        }

        const data = await prisma.Kumpul_Tugas.create({
            data: {
                id_user,
                id_tugas,
                nama,
                nim,
                kelompok,
                link_tugas
            }
        });

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengumpulkan tugas",
                data
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal mengumpulkan tugas"
            });
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        });
    }
};
exports.EditKumpulTugas = async (req, res) => {
    try {
        const { id, nama, nim, kelompok, link_tugas } = req.body;

        // Ambil data tugas untuk cek deadline
        const kumpulTugas = await prisma.Kumpul_Tugas.findUnique({ where: { id } });
        if (!kumpulTugas) {
            return res.status(404).json({ status: 404, message: "Pengumpulan tugas tidak ditemukan." });
        }
        const tugas = await prisma.Tugas.findUnique({ where: { id: kumpulTugas.id_tugas } });
        if (!tugas) {
            return res.status(404).json({ status: 404, message: "Tugas tidak ditemukan." });
        }
        if (tugas.deadline && new Date() > new Date(tugas.deadline)) {
            return res.status(400).json({ status: 400, message: "Sudah lewat deadline, tidak bisa edit tugas." });
        }

        const data = await prisma.Kumpul_Tugas.update({
            where: { id },
            data: { nama, nim, kelompok, link_tugas }
        });

        if (data) {
            return res.status(200).json({ status: 200, message: "Berhasil mengedit tugas", data });
        } else {
            return res.status(400).json({ status: 400, message: "Gagal mengedit tugas", data });
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error", error });
    }
}