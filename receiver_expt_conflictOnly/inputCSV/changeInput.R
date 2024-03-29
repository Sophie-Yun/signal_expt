library(dplyr)
expt <- read.csv("OneDrive - UCLA IT Services/UCLA/Research/Steph/signal_expt/receiver_expt_cond3/inputCSV/exptTrials_receiver_20220112.csv")
flipSubset <- expt %>% filter(abstractSetup == "Flip")
flipDiySubset <- expt %>% filter(abstractSetup == "Flip" | abstractSetup == "DIY" )
write.csv(flipSubset,"OneDrive - UCLA IT Services/UCLA/Research/Steph/signal_expt/receiver_expt_cond3/inputCSV/conflictOnly_20220215.csv", row.names = FALSE)
write.csv(flipDiySubset,"OneDrive - UCLA IT Services/UCLA/Research/Steph/signal_expt/receiver_expt_cond3/inputCSV/expt_conflictDiyOnly_20220215.csv", row.names = FALSE)
